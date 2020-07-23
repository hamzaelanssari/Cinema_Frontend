import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {CinemaService} from '../services/cinema.service';

@Component({
  selector: 'app-cinema',
  templateUrl: './cinema.component.html',
  styleUrls: ['./cinema.component.css']
})
export class CinemaComponent implements OnInit {

  public villes;
  public cinemas;
  public salles;
  public villeActuel;
  public cinemaActuel;
  public projectionActuel;
  public selectedTickets: any;

  constructor(public cinemaService: CinemaService) { }

  ngOnInit(): void {
    this.cinemaService.getVilles()
      .subscribe(data => {
          this.villes = data;
      }, err => {
        console.log(err);

      }
      );
  }

  // tslint:disable-next-line: typedef
  onGetCinemas(ville){
    this.villeActuel = ville;
    this.cinemaActuel = undefined;
    this.salles = undefined;
    this.cinemaService.getCinemas(ville)
      .subscribe(data => {
        this.cinemas = data;
    }, err => {
      console.log(err);

    }
    );
  }

  // tslint:disable-next-line: typedef
  onGetSalles(cinema){
    this.cinemaActuel = cinema;
    this.cinemaService.getSalles(cinema)
    .subscribe(data => {
      this.salles = data;
      this.salles._embedded.salles.forEach(salle => {
        this.cinemaService.getProjections(salle)
        // tslint:disable-next-line: no-shadowed-variable
        .subscribe(data => {
          salle.projections = data;
      }, err => {
        console.log(err);

      }
      );

      });
  }, err => {
    console.log(err);

  }
  );
  }

 // tslint:disable-next-line: typedef
 onGetTickets(projection){
  this.projectionActuel = projection;
  this.cinemaService.getTickets(projection)
    .subscribe(data => {
     this.projectionActuel.tickets = data;
     this.selectedTickets = [];
  }, err => {
    console.log(err);

  });

}

// tslint:disable-next-line: typedef
onSelectTicket(ticket){
  if (!ticket.selected){
    ticket.selected = true;
    this.selectedTickets.push(ticket);
  }
  else{
    ticket.selected = false;
    this.selectedTickets.splice(this.selectedTickets.indexOf(ticket), 1);
  }


}

// tslint:disable-next-line: typedef
getTicketClass(ticket){
  let str = 'btn ticket ';
  if (ticket.reserve == true) {
    str += 'btn-danger';
  }
  else if (ticket.selected) {
    str += 'btn-warning';
 }
  else {
    str += 'btn-success';
 }

  return str;
}

// tslint:disable-next-line: typedef
onPayTickets(dataForm){
const tickets = [];
this.selectedTickets.forEach(ticket => {
  tickets.push(ticket.id);
});
dataForm.tickets = tickets;
this.cinemaService.payTickets(dataForm)
  .subscribe(data => {
    alert('Ticket réservés avec succés!');
    this.onGetTickets(this.projectionActuel);
  }, err => {
  console.log(err);

});
console.log(dataForm);
}

}
