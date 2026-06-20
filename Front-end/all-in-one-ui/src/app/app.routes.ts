import { ResolveStart, Routes } from '@angular/router';
import { Login } from './features/auth/login/login';
import { Welcome } from './features/auth/welcome/welcome';
import { CountryComponent } from './features/admin/country/country';
import { State } from './features/admin/state/state';
import { Division } from './features/admin/division/division';
import { District } from './features/admin/district/district';
import { TenantType } from './features/admin/tenant-type/tenant-type';
import { Organization } from './features/admin/organization/organization';
import { OrganizationBranchComponent } from './features/admin/organization-branch/organization-branch';
import { User } from './features/admin/users/users';
import { RoleComponent } from './features/admin/roles/roles';
import { PermissionComponent } from './features/admin/permissions/permissions';
import { UserTypeComponent } from './features/admin/user-roles/user-roles';
import { ActionComponent } from './features/admin/actions/actions';


export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  { path: 'login', component: Login },

  {
    path: 'welcome',
    component: Welcome,
    children: [
      { path: 'country', component: CountryComponent },
      {path: 'state', component: State },
      {path: 'division', component: Division },
      {path: 'district', component: District },
      {path: 'tenant-type', component: TenantType },
      {path:'organization', component: Organization },
      {path:'organization-branch', component: OrganizationBranchComponent },
      {path:'users', component: User },
      {path:'roles', component: RoleComponent },
      {path:'permissions', component: PermissionComponent },
      {path:'user-roles', component: UserTypeComponent },
      {path:'actions', component: ActionComponent }
    ]
  },

  { path: '**', redirectTo: 'login' }
];