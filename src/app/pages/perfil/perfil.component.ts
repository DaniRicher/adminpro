import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Usuario } from 'src/app/models/usuario.model';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styles: [
  ]
})
export class PerfilComponent implements OnInit {

  public perfilForm!: FormGroup;
  public usuario!: Usuario;
  public imagenSubir!: File;
  public imgTemp: any;

  constructor( private fb: FormBuilder,
               private usuarioService: UsuarioService,
               private fileUploadService: FileUploadService ) {

                this.usuario = usuarioService.usuario
               }

  ngOnInit(): void {
    
    this.perfilForm = this.fb.group({
      nombre: [ this.usuario.nombre, [ Validators.required ] ],
      email: [ this.usuario.email, [ Validators.required, Validators.email ] ],
    });

  }

  actualizarPerfil() {
    console.log( this.perfilForm.value );
    this.usuarioService.actualizarPerfil( this.perfilForm.value )
        .subscribe( ({usuario}:any) => {
          // const { nombre, email } = this.perfilForm.value
          this.usuario.nombre = usuario.nombre;
          this.usuario.email = usuario.email;
          Swal.fire('Guardado', 'Cambios guardados', 'success' )
        }, (err) => {
          Swal.fire('Error', err.error.msg, 'error');
        });
  }

  cambiarImagen( event:any ) {
    
    let file: File = event.target.files[0];

    this.imagenSubir = file;

    if( !file ) { 
      return this.imgTemp = null;
    }

    const reader = new FileReader();
    reader.readAsDataURL( file );

    return reader.onloadend = () => {
      this.imgTemp = reader.result;
    }
  }

  subirImagen() {
    this.fileUploadService
        .actualizarFoto( this.imagenSubir, 'usuarios', this.usuario.uid! )
          .then( img => {
            this.usuario.img = img 
            Swal.fire( 'Actualizado', 'Foto actualizada correctamente', 'success' );
          }).catch( err => {
            console.log(err);
          Swal.fire('Error', 'No se pudo actualizar la imagen', 'error');
          })
  }

}
