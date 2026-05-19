import { Routes } from '@angular/router';

/**
 * All routes are lazy-loaded standalone components.
 * Pages live under src/app/pages/.
 */
export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home.component').then((m) => m.HomeComponent),
    title: 'JTech App Store',
  },
  {
    path: 'browse',
    loadComponent: () => import('./pages/browse.component').then((m) => m.BrowseComponent),
    title: 'Browse apps · JTech App Store',
  },
  {
    path: 'app/:id',
    loadComponent: () => import('./pages/app-detail.component').then((m) => m.AppDetailComponent),
    title: 'App · JTech App Store',
  },
  {
    path: 'submit',
    loadComponent: () => import('./pages/submit.component').then((m) => m.SubmitComponent),
    title: 'Submit an app · JTech App Store',
  },
  {
    path: 'edit/:id',
    loadComponent: () => import('./pages/submit.component').then((m) => m.SubmitComponent),
    title: 'Edit app · JTech App Store',
  },
  {
    path: 'library',
    loadComponent: () => import('./pages/library.component').then((m) => m.LibraryComponent),
    title: 'My library · JTech App Store',
  },
  {
    path: 'profile',
    loadComponent: () => import('./pages/profile.component').then((m) => m.ProfileComponent),
    title: 'My developer profile · JTech App Store',
  },
  {
    path: 'developer/:username',
    loadComponent: () =>
      import('./pages/developer.component').then((m) => m.DeveloperComponent),
    title: 'Developer · JTech App Store',
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login.component').then((m) => m.LoginComponent),
    title: 'Log in · JTech App Store',
  },
  {
    path: 'signup',
    loadComponent: () => import('./pages/signup.component').then((m) => m.SignupComponent),
    title: 'Sign up · JTech App Store',
  },
  {
    path: 'admin',
    loadComponent: () => import('./pages/admin.component').then((m) => m.AdminComponent),
    title: 'Admin review · JTech App Store',
  },
  {
    path: 'about',
    loadComponent: () => import('./pages/about.component').then((m) => m.AboutComponent),
    title: 'About · JTech App Store',
  },
  { path: '**', redirectTo: '' },
];
