import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../login/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private _authService:AuthService,
    private _router: Router) { }

  ngOnInit(): void {
  }

  logout(){
    this._authService.logout();
    this._router.navigate(['/login']);
  }
}
