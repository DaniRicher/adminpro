import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CargarUsuarios } from '../interfaces/cargar-usuarios.interface';
import { LoginForm } from '../interfaces/login-form.interfaces';
import { RegisterForm } from '../interfaces/register-form.interfaces';
import { Usuario } from '../models/usuario.model';

declare const google: any;

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

public usuario!: Usuario;

  constructor( private http: HttpClient,
               private router:Router ) { 
              }

  
  get token():string {
    return localStorage.getItem('token') || '';
  }

  get uid() {
    return this.usuario.uid
  }

  get headers() {
    return { 
      headers: {
        'x-token': this.token,
      }}
  }

  logout() {

      localStorage.removeItem('token');
      this.router.navigateByUrl('/login');

      google.accounts.id.revoke( 'richerdani3@gmail.com', () => {
      this.router.navigateByUrl('/login');
    });
  }

  validarToken(): Observable<boolean> {
    

    return this.http.get(`${ base_url }/login/renew`, {
      headers: {
        'x-token' : this.token
      },
    }).pipe(
      map ( ( resp:any ) => {

        // console.log(resp);
        const { email, google, nombre, role, img = '', uid } = resp.usuarioDB;

        this.usuario = new Usuario( nombre, email, '', img, google, role, uid );
        
        localStorage.setItem('token', resp.token);
        return true;
      }), 
      catchError( error => of(false) )
    );
  }

  crearUsuario( formData:RegisterForm ) {

    return this.http.post(`${ base_url }/usuarios`, formData )
      .pipe(
        tap( (resp: any ) => {
          localStorage.setItem('token', resp.token);
        }),
      );
    
  }

  actualizarPerfil( data: { email: string, nombre: string, role: string }) {
    data = {
      ...data,
      role: this.usuario.role!
    }
    return this.http.put(`${ base_url }/usuarios/${ this.uid }`, data, this.headers );

  }

  login( formData:LoginForm ) {

    return this.http.post(`${ base_url }/login`, formData )
      .pipe(
        tap( (resp: any ) => {
          localStorage.setItem('token', resp.token);
        }),
      );
    
  }

  loginGoogle( token:string ) {
    return this.http.post(`${ base_url }/login/google`, { token } )
      .pipe(
        tap( (resp: any ) => {
          // console.log(resp);
          localStorage.setItem('token', resp.token);
        }),
      )
  }

  cargarUsuarios( desde:number = 0 ) {
    const url = `${ base_url }/usuarios?desde=${ desde }`;
    return this.http.get<CargarUsuarios>( url, this.headers )
        .pipe(
          map( resp=> {
            const usuarios = resp.usuarios.map(
              user => new Usuario( user.nombre, user.email, '', user.img, user.google, user.role, user.uid ) 
              );
            return {
              total: resp.total,
              usuarios
            };
          }),
        );
  }

  eliminarUsuario( usuario:Usuario ) {
    const url = `${ base_url }/usuarios/${ usuario.uid }`

    return this.http.delete( url, this.headers );
   
  }

  guardarUsuario( usuario: Usuario ) {

    return this.http.put(`${ base_url }/usuarios/${ usuario.uid }`, usuario, this.headers );

  }

}
