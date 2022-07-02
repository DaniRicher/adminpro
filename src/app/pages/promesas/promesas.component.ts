import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-promesas',
  templateUrl: './promesas.component.html',
  styleUrls: ['./promesas.component.css']
})
export class PromesasComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {

    this.getUsuarios().then( usuarios => {
      console.log(usuarios);
    });
    // const promesa = new Promise ( (resolve, reject) => {
    //   if( false ){
    //     resolve('Hola Mundo');
    //   }else{
    //     reject('Reject');
    //   }
    // });

    // promesa.then( (mensaje) => {
    //     console.log(mensaje);
    // }).catch( error => console.log( 'Algo salio mal', error));
    // console.log('Fin del Init');
  }

  getUsuarios () {
    const url = `https://reqres.in/api/users`;

    const promesa = new Promise( resolve => {
      fetch( url )
      .then( resp => resp.json() )
      .then( body => resolve(body.data) );
    });

    return promesa;
  }

}
