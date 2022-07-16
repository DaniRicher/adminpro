import { Component, OnInit } from '@angular/core';
import { Hospital } from 'src/app/models/hospital.model';
import { HospitalService } from 'src/app/services/hospital.service';

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: [
  ]
})
export class HospitalesComponent implements OnInit {

  public hospitales: any = [];
  public cargando: boolean = true;

  constructor( private hospitalService: HospitalService ) { }

  ngOnInit(): void {
    this.cargarHospitales();
  }

  cargarHospitales() {

    this.cargando = true;
    this.hospitalService.cargarHospitales()
        .subscribe( resp => {

          this.cargando = false;
          this.hospitales = resp.hospitales;
          console.log(this.hospitales);

        });
  }

}
