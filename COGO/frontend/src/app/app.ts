import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Nav } from './nav/nav';
import { ToastComponent } from './toast/toast';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Nav, ToastComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('frontend');


}
