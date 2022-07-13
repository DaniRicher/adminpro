import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

declare const google: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: [ './login.component.css']
})
export class LoginComponent implements OnInit, AfterViewInit {

  @ViewChild('googleBtn') googleBtn!:ElementRef;

  public loginForm = this.fb.group({

    email:[ localStorage.getItem('email') || '', [ Validators.required, Validators.email ]],
    password:[ '', [ Validators.required ]],
    remember: [false]

  });

  constructor( private router:Router,
               private fb:FormBuilder,
               private usuarioService: UsuarioService,
               private ngZone: NgZone) { }

  ngAfterViewInit(): void {
    this.googleInit();
  }

  googleInit() {
    google.accounts.id.initialize({
      client_id: "82679584460-ht6olj7dvg3vh00jn9umoe0f914c23im.apps.googleusercontent.com",
      callback: (response:any) => this.handleCredentialResponse( response ),
    });
    google.accounts.id.renderButton(
      // document.getElementById("buttonDiv"),
      this.googleBtn.nativeElement,
      { theme: "outline", size: "large" }  // customization attributes
    );
  }

  handleCredentialResponse( response:any ) {
    // console.log("Encoded JWT ID token: " + response.credential);
    this.usuarioService.loginGoogle( response.credential )
      .subscribe( resp => {
        // console.log({login : resp});
        this.ngZone.run( () => {
          this.router.navigateByUrl('/');
        })
      });
  }

  ngOnInit(): void {
  }

  login(){

    console.log( this.loginForm.value );

    this.usuarioService.login ( this.loginForm.value )
          .subscribe( data => {
            if( this.loginForm.get('remember')?.value ){
              localStorage.setItem('email', this.loginForm.get('email')?.value );
            } else {
              localStorage.removeItem('email');
            }
          this.router.navigateByUrl('/');

            console.log(data);
          }, (err)=> {
            console.log(err);
            Swal.fire('Error', err.error.msg, 'error')
          });
  }

}
