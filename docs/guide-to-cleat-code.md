Feature-Based Directory Structure in Angular: A Step-by-Step Guide to Clean Code and Scalable Apps
==================================================================================================

Learn How to Organize Your Angular Project by Features to Streamline Development and Boost Maintainability
----------------------------------------------------------------------------------------------------------

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*vIdbrgg9I41ZXoHe76UT9Q.png)

When it comes to building scalable applications in Angular, organizing your files and folders effectively can be the difference between a smooth, manageable project and a tangled web of spaghetti code. Today, I’ll walk you through setting up a **feature-based directory structure** in Angular 18. Trust me; your future self will thank you when debugging or adding new features.

Let’s dive into the process, step by step, and keep things light-hearted along the way! After all, what’s better than some Angular humor? Nothing — except maybe TypeScript puns.

What is a Feature-Based Directory Structure?
--------------------------------------------

A feature-based directory structure organizes code into “feature folders,” each containing everything related to a specific feature or module, like services, components, and routes. The goal? **Modularity and maintainability**. Rather than having a single `components` folder with a hundred files, we separate each feature into its own folder, keeping our app clean and organized.

Step 1: Set Up the Angular Project
----------------------------------

1.1 Initialize Your Angular 18 Project
--------------------------------------

Start by generating a new Angular project. Fire up your terminal and use the Angular CLI:

```
ng new feature-based-structure-demo
cd feature-based-structure-demo
```

Select routing and SCSS (or your preferred styling format). Angular will create a default structure for you.

> **_Bonus Tip_**_: Always use Angular CLI for setup. It configures the environment correctly, handling dependencies, basic files, and project structure._

1.2 Organize by Feature
-----------------------

In the Angular project, let’s start with a clean directory structure focused on features. We’ll create our main folders:

```
src/
 ├── app/
 │   ├── core/
 │   ├── shared/
 │   ├── features/
 │   │   ├── auth/
 │   │   ├── dashboard/
 │   │   ├── products/
 │   ├── app-routing.module.ts
 │   ├── app.module.ts
 │   └── app.component.ts
```

* **Core**: For singletons like `AuthService` and global services.
* **Shared**: For reusable components, directives, and pipes.
* **Features**: For feature-specific modules.

> **_Best Practice_**_: Aim for a structure that matches your app’s logical features. Don’t create unnecessary folders. Too many layers can be just as confusing as too few._

Step 2: Create Feature Modules and Components
---------------------------------------------

2.1 Generate a New Module for Each Feature
------------------------------------------

For our demo, let’s start with the `auth` feature. In the terminal:

```
ng generate module features/auth --route login --module app-routing.module
```

This command does two things:

1. Creates an `auth` folder under `features` with its own module file.
2. Sets up lazy loading for the `login` route.

2.2 Create Components in Each Module
------------------------------------

Inside the `features/auth` folder, generate components for `Login` and `Register`:

```
ng generate component features/auth/login
ng generate component features/auth/register
```

Now, our `auth` folder should look like this:

```
features/
 ├── auth/
 │   ├── login/
 │   │   └── login.component.ts
 │   ├── register/
 │   │   └── register.component.ts
 │   └── auth.module.ts
```

> **_Bonus Tip_**_: Make feature components specific and self-contained. Feature-based structures are all about reusability. Components should handle one thing well._

Step 3: Code Feature Modules with Lazy Loading
----------------------------------------------

Lazy loading is essential for optimized Angular apps. Let’s define routes in the `auth` feature module to enable this.

3.1 Setting Up Routes in `auth-routing.module.ts`
-------------------------

Add a `auth-routing.module.ts` file inside the `auth` folder:

```
// features/auth/auth-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
const routes: Routes = [  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule {}
```

> **_Best Practice_**_: Route configuration should be modularized. Each feature module should declare its own routes, encapsulated in its routing file._

3.2 Connect Auth Routes to the App Routing Module
-------------------------------------------------

Update `app-routing.module.ts` to lazy load the `auth` module:

```
// app/app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
const routes: Routes = [  { path: 'auth', loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule) },
  { path: '', redirectTo: '/auth/login', pathMatch: 'full' }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
```

Explanation
-----------

Here, we specify the `auth` module as a lazy-loaded module. Angular will only load it when we navigate to an `auth` route. This significantly improves initial load times for larger applications.

> **_Bonus Tip_**_: Use lazy loading strategically for features that aren’t required at app startup, like dashboards or settings._

Step 4: Share Reusable Code with the Shared Module
--------------------------------------------------

4.1 Create a Shared Module
--------------------------

Shared modules are for components, directives, or pipes you’ll use across the app. Generate it like so:

```
ng generate module shared
```

Add a simple `ButtonComponent` for demo purposes:

```
// shared/button/button.component.ts
import { Component, Input } from '@angular/core';
@Component({
  selector: 'app-button',
  template: `<button [class]="buttonType">{{ label }}</button>`,
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent {
  @Input() label: string = 'Button';
  @Input() buttonType: string = 'primary';
}
```

Import `ButtonComponent` into `SharedModule`:

```
// shared/shared.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from './button/button.component';
@NgModule({
  declarations: [ButtonComponent],
  imports: [CommonModule],
  exports: [ButtonComponent] // <-- Export so other modules can use it
})
export class SharedModule {}
```

Explanation
-----------

The `ButtonComponent` is reusable, making our code DRY (Don’t Repeat Yourself). We import the `SharedModule` into any feature modules that need it.

> **_Best Practice_**_: Export only necessary components from shared modules. Overloading it can lead to performance issues._

Step 5: Organize Services in Core Module
----------------------------------------

5.1 Create the Core Module for Singleton Services
-------------------------------------------------

Generate the `core` module and add a sample `AuthService`:

```
ng generate module core
```

// core/services/auth.service.ts
import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  login(username: string, password: string): boolean {
    return username === 'admin' && password === 'admin';
  }
}

```

Explanation
-----------

Singleton services are placed in the core module to keep them accessible across the app without creating multiple instances.

> **_Bonus Tip_**_: Use the_ `_providedIn: 'root'_` _syntax for singletons. It’s efficient and standard in Angular._

Full Code Example
-----------------

With our setup complete, here’s the full code structure you can use to jump-start your feature-based Angular project.

Directory Structure
-------------------

```

src/
 ├── app/
 │   ├── core/
 │   │   ├── services/
 │   │   │   └── auth.service.ts
 │   ├── shared/
 │   │   ├── button/
 │   │   │   └── button.component.ts
 │   │   └── shared.module.ts
 │   ├── features/
 │   │   ├── auth/
 │   │   │   ├── login/
 │   │   │   │   └── login.component.ts
 │   │   │   ├── register/
 │   │   │   │   └── register.component.ts
 │   │   │   ├── auth-routing.module.ts
 │   │   │   └── auth.module.ts
 │   ├── app-routing.module.ts
 │   └── app.module.ts

```

Conclusion
----------

Setting up a feature-based directory structure in Angular 18 takes time, but the payoff is well worth it. This approach brings organization, scalability, and maintainability to your codebase. With a modular approach, you’ll find debugging and adding features much easier, giving you more time to focus on what really matters: building great applications.

> **For a daily dose of SofTech, follow me on LinkedIn**: [Sehban Alam](https://www.linkedin.com/in/sehbanalam/)
```
