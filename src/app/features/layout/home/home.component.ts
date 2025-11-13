import { RouterOutlet } from '@angular/router';
import { FooterComponent } from '@/app/features/layout/home/footer/footer.component';
import { HeaderComponent } from '@/app/features/layout/home/header/header.component';
import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: './home.component.html',
})
export class HomeComponent {}
