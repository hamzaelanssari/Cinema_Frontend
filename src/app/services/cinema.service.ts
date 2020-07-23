import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CinemaService {

  public host = 'http://localhost:8080';

  constructor(private http: HttpClient) { }

  // tslint:disable-next-line: typedef
  public getVilles(){
    return this.http.get(this.host + '/villes');
  }

  // tslint:disable-next-line: typedef
  public getCinemas(ville){
    return this.http.get(ville._links.cinemas.href);
  }

  // tslint:disable-next-line: typedef
  public getSalles(cinema){
    return this.http.get(cinema._links.salles.href);
  }

  // tslint:disable-next-line: typedef
  public getProjections(salle){
    const url = salle._links.projections.href.replace('{?projection}', '');
    return this.http.get(url + '?projection=p1');
  }

  // tslint:disable-next-line: typedef
  public getTickets(projection){
    const url = projection._links.tickets.href.replace('{?projection}', '');
    return this.http.get(url + '?projection=ticketProj');
  }

  // tslint:disable-next-line: typedef
  public payTickets(dataForm){
    return this.http.post(this.host + '/payerTickets', dataForm);

  }
}
