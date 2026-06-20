import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './welcome.html',
  styleUrl: './welcome.css'
})
export class Welcome {
  userName: string = 'Naresh Kumar';
  userRole: string = 'Super Admin';
  organizationCode: string = 'AIO001';

  adminMenus = [
    {
      title: 'Geography Management',
      items: ['Country', 'State', 'District', 'Division']
    },
    {
      title: 'Tenant Management',
      items: ['Tenant Type', 'Organization', 'Organization Branch']
    },
    {
      title: 'Security Management',
      items: [ 'Roles', 'User Types','Roles(Action)','Users']
    },
    {
      title: 'Subscription',
      items: ['Subscription Plans', 'Tenant Subscriptions']
    }
  ];

  dashboardCards = [
    { title: 'Organizations', count: 12, icon: '🏢' },
    { title: 'Branches', count: 28, icon: '📍' },
    { title: 'Users', count: 142, icon: '👥' },
    { title: 'Roles', count: 8, icon: '🛡️' },
    { title: 'Subscriptions', count: 6, icon: '💳' },
    { title: 'Chat Commands', count: 15, icon: '🤖' }
  ];

  selectedMenu: string = 'Dashboard';

  constructor(public router: Router) {
    // this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  selectMenu(menu: string) {
    this.selectedMenu = menu;

    if (menu === 'Dashboard') {
      this.router.navigate(['/welcome']);
    } else if (menu === 'Country') {
      this.router.navigate(['/welcome/country']);
    }
    else if(menu==='State'){
      this.router.navigate(['/welcome/state']);
    }
    else if(menu==='Division'){
      this.router.navigate(['/welcome/division']);
    }
    else if (menu === 'District') {
      this.router.navigate(['/welcome/district']);
    }
    else if(menu==='Tenant Type')
      {
      this.router.navigate(['/welcome/tenant-type']);
    }
    else if(menu==='Organization')
    {
      this.router.navigate(['/welcome/organization']);
    }
    else if(menu==='Organization Branch')    {
      this.router.navigate(['/welcome/organization-branch']);
    }
    else if(menu==='Users')    {
      this.router.navigate(['/welcome/users']);
    }
    else if(menu==='Roles')    {
      this.router.navigate(['/welcome/roles']);
    }
      else if(menu==='Permissions')    {
      this.router.navigate(['/welcome/permissions']);
    }
    else if(menu==='User Types')    {
      this.router.navigate(['/welcome/user-roles']);
    }
    else if(menu==='Roles(Action)')    {
      this.router.navigate(['/welcome/actions']);
    }
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  isDashboardPage(): boolean {
    return this.router.url === '/welcome';
  }
}