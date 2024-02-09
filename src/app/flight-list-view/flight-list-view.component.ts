import {AfterViewInit, Component} from '@angular/core';
import {Flight} from "../flight";
import {FlightService} from "../flight.service";
import {SelectionModel} from "@angular/cdk/collections";
import {catchError, map, merge, of, startWith, switchMap} from "rxjs";

@Component({
    selector: 'app-flight-list-view',
    templateUrl: './flight-list-view.component.html',
    styleUrl: './flight-list-view.component.css',
})
export class FlightListViewComponent implements AfterViewInit {
  isLoading = true;
  flights: Flight[] = [];
  selection = new SelectionModel<Flight>(false, []);
  displayedColumns: string[] = [
    'select',
    'name',
    'airline',
    'class',
    'seatNumber',
    'departureDate',
    'arrivalDate',
    'details'
  ];

  constructor(private flightService: FlightService) {}

  ngAfterViewInit(): void {
    this.getAllFlights();
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.flights.length;
    return numSelected === numRows;
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: Flight): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'}`;
  }

  removeFlight(): void {
    const flight = this.selection.selected[0];

    if (flight) {
      this.flightService.deleteFlight(flight.id)
          .subscribe(() => {
            // reload the data so we see the table update
            this.getAllFlights();
            this.selection.clear();
          });
    }
  }

  getAllFlights(): void {
    merge()
        .pipe(
            startWith({}),
            switchMap(() => {
              this.isLoading = true;
              return this.flightService.getFlights()
                  .pipe(catchError(() => of(null)));
            }),
            map(data => {
              // Flip flag to show that loading has finished.
              this.isLoading = false;

              if (data === null) {
                return [];
              }

              return data;
            }),
        )
        .subscribe(data => (this.flights = data));
  }
}
