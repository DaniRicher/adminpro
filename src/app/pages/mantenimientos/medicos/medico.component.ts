import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { delay } from 'rxjs';
import { Hospital } from 'src/app/models/hospital.model';
import { Medico } from 'src/app/models/medico.model';
import { HospitalService } from 'src/app/services/hospital.service';
import { MedicoService } from 'src/app/services/medico.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-medico',
  templateUrl: 'medico.component.html',
  styles: [
  ]
})
export class MedicoComponent implements OnInit {

  public medicoForm!: FormGroup;
  public hospitales: Hospital[] = [];

  public medicoSeleccionado!: Medico;
  public hospitalSeleccionado!: Hospital;




  constructor( private fb: FormBuilder,
               private hospitalService: HospitalService,
               private medicoService: MedicoService,
               private router: Router,
               private activateRoute: ActivatedRoute ) { }

  ngOnInit(): void {

    this.activateRoute.params.subscribe( ({ id }) => {
      this.cargarMedico( id );
    })

    
    this.medicoForm = this.fb.group({

      nombre : ['', [Validators.required]],
      hospital : ['', [Validators.required]],

    });

    this.cargarHospitales();
    this.medicoForm.get('hospital')?.valueChanges
          .subscribe( hospitalId => {
            this.hospitalSeleccionado = this.hospitales.find( h => h._id === hospitalId )!;
          });
  }

  cargarMedico( id: string ) {

    if( id === 'nuevo' ){
      return;
    }

    this.medicoService.obtenerMedicoPorId( id )
          .pipe(
            delay(100)
          )
          .subscribe( medico => {
            
            if( !medico ) {
              return this.router.navigateByUrl(`/dashboard/medicos`);
            }
            const { nombre, hospital: { _id }} = medico;
            this.medicoSeleccionado = medico;
            return this.medicoForm.setValue({ nombre, hospital: _id });
          });

  }

  cargarHospitales() {
    this.hospitalService.cargarHospitales()
        .subscribe( ( data ) => {
          this.hospitales = data.hospitales;
        })
  }

  guardarMedico() {

    const { nombre } = this.medicoForm.value;

    if( this.medicoSeleccionado ) {
      //actualizar
      const data = {
        ...this.medicoForm.value,
        _id: this.medicoSeleccionado._id,
      }
      this.medicoService.actualizarMedicos( data )
          .subscribe( resp => {
            Swal.fire('Actualizado con exito', `${ nombre }`, 'success');
          })
    } else {
      //Crear
      this.medicoService.crearMedicos( this.medicoForm.value )
          .subscribe( (resp:any) => {
            Swal.fire('Creado con exito', `${ nombre }`, 'success');
            this.router.navigateByUrl(`/dashboard/medico/${ resp.medico._id }`);
          });
    }


  }

}
