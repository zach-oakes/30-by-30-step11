import {Injectable} from '@angular/core';
import {Flight} from "./flight";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {catchError, Observable, of} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class FlightService {
    private url = 'https://mock-json-server-five.vercel.app/flights';
    private httpOptions = {
        headers: new HttpHeaders({'Content-Type': 'application/json'})
    };

    constructor(private http: HttpClient) {
    }

    getFlights(): Observable<Flight[]> {
        return this.http.get<Flight[]>(this.url)
            .pipe(
                // return an empty array here if there was an error on the request
                catchError(this.handleError<Flight[]>([]))
            );
    }

    getFlight(id: string): Observable<Flight> {
        const url = `${this.url}/${id}`;

        return this.http.get<Flight>(url);
    }

    deleteFlight(id: string): Observable<any> {
        const url = `${this.url}/${id}`;

        return this.http.delete<Flight>(url, this.httpOptions)
            .pipe(
                catchError(this.handleError<any>('Delete failed'))
            );
    }

    updateFlight(flight: Flight): Observable<any> {
        const url = `${this.url}/${flight.id}`;

        return this.http.put(url, flight, this.httpOptions).pipe(
            catchError(this.handleError<any>('Update failed'))
        );
    }

    addFlight(flight: Flight): Observable<Flight> {
        return this.http.post<Flight>(this.url, flight, this.httpOptions)
            .pipe(
                catchError(this.handleError<any>('Add failed'))
            );
    }

    private handleError<T>(result?: T) {
        return (error: any): Observable<T> => {

            console.error(error); // log to console instead

            // Let the app keep running by returning an empty result.
            return of(result as T);
        };
    }
}
