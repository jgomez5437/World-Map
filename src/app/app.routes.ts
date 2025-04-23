import { Routes } from '@angular/router';
import { IndexComponent } from './index/index.component';

// starts the website on index.component.html
export const routes: Routes = [
    { path: 'index', component: IndexComponent },
    { path: '' , redirectTo: '/index', pathMatch: 'full' }
];
