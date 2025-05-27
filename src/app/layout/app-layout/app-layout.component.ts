import { Component, OnInit, ViewChild } from '@angular/core'; 
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { CohacerOnboardingComponent } from '../../components/cohacer-onboarding/cohacer-onboarding.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, CohacerOnboardingComponent],
  templateUrl: './app-layout.component.html',
  styleUrls: ['./app-layout.component.scss']
})
export class AppLayoutComponent implements OnInit {
  @ViewChild(CohacerOnboardingComponent)
  onboardingComponent!: CohacerOnboardingComponent;

  sidebarOpen = false;
  user: any = null;
  groupedMenu: { [group: string]: { icon: string, text: string, href: string }[] } = {};

  constructor(private router: Router) {
    const stored = localStorage.getItem('user');
    this.user = stored ? JSON.parse(stored) : null;
  }

  ngOnInit(): void {
    this.groupedMenu = this.getGroupedMenu();
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.runOnboarding(), 500);
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigateByUrl('/login');
  }

  getGroupedMenu(): { [group: string]: { icon: string, text: string, href: string }[] } {
    if (!this.user || this.user.message === "Unauthorized") return {};

    const permissions = this.user.permissions || [];
    const enrolls = this.user.enrolls || [];

    const menu: { icon: string, text: string, href: string, group: string }[] = [
      { icon: 'home', text: 'Inicio', href: '/app', group: 'General' },
      { icon: 'chat', text: 'Chat', href: '/app/chat', group: 'General' },
      { icon: 'overview', text: 'Proceso anterior', href: '/app/proceso', group: 'General' },
      { icon: 'communities', text: 'Tribu', href: '/app/mitribu', group: 'Tribu' },
      { icon: 'logout', text: 'Salir', href: '/logout', group: 'General' },

      { icon: 'person', text: 'Empleados', href: '/app/rrhh/empleados', group: 'Recursos humanos' },
      { icon: 'account_tree', text: 'Organigrama', href: '/app/organigrama', group: 'Recursos humanos' },
      { icon: 'person_apron', text: 'Empleados', href: '/app/empleados', group: 'Recursos humanos' },

      { icon: 'price_change', text: 'Financiación', href: '/app/administracion/financiar', group: 'Administración' },
      { icon: 'mail_lock', text: 'Ligas de pago', href: '/app/administracion/ligasdepago', group: 'Administración' },

      { icon: 'person_search', text: 'Revisar expediente', href: '/app/evaluadora/iutmrevision', group: 'Evaluadora' },
      { icon: 'view_comfy_alt', text: 'Ver estatus expedientes', href: '/app/procesos/expedientes', group: 'Procesos' },
      { icon: 'event_upcoming', text: 'Periodos', href: '/app/periodos', group: 'Procesos' },
      { icon: 'calendar_clock', text: 'Retrasos', href: '/app/retrasos', group: 'Procesos' },
      { icon: 'cast_for_education', text: 'Clases', href: '/app/clases', group: 'Procesos' },
      { icon: 'partner_exchange', text: 'Profesores', href: '/app/profesores', group: 'Procesos' },

      { icon: 'flowsheet', text: 'Expediente', href: '/app/proceso/expediente', group: 'Sustentante' },
      { icon: 'work_history', text: 'CV', href: '/app/proceso/cv', group: 'Sustentante' },
      { icon: 'school', text: 'Formación', href: '/app/formacion', group: 'Sustentante' },
      { icon: 'glyphs', text: 'Simulaciones', href: '/app/habilidades', group: 'Sustentante' },
      { icon: 'shelves', text: 'Materiales', href: '/app/materiales', group: 'Sustentante' },

      { icon: 'contact_page', text: 'Curriculum vitae', href: '/app/cv', group: 'CV' },
      { icon: 'user_attributes', text: 'Revisar Curriculum', href: '/app/revisarCurriculum', group: 'CV' },
      { icon: 'demography', text: 'Caso práctico', href: '/app/casopractico', group: 'Caso práctico' },
      { icon: 'demography', text: 'Memoria descriptiva', href: '/app/casopractico', group: 'Caso práctico' },
      { icon: 'engineering', text: 'Revisar caso práctico', href: '/app/revisarCasoPractico', group: 'Caso práctico' },

      { icon: 'account_balance', text: 'Mis finanzas', href: '/app/financiacion', group: 'Finanzas' },
      { icon: 'credit_card_heart', text: 'Pagos a revisar', href: '/app/pagosarevisar', group: 'Finanzas' },
      { icon: 'credit_card', text: 'Pagos realizados', href: '/app/pagosrealizados', group: 'Finanzas' },
      { icon: 'conversion_path', text: 'Ligas de pago', href: '/app/pagospendientes', group: 'Finanzas' },

      { icon: 'person_add', text: 'Agregar sustentante', href: '/app/agregarusuario', group: 'Ventas' },
      { icon: 'person_alert', text: 'Prospectos', href: '/app/prospectos', group: 'Ventas' },

      { icon: 'emoji_people', text: 'Inscripciones', href: '/app/inscripcionestribu', group: 'Tribu' },
      { icon: 'diversity_2', text: 'Red', href: '/app/redtribu', group: 'Tribu' },

      { icon: 'campaign', text: 'Campañas', href: '/app/campanas', group: 'Marketing' },
      { icon: 'satellite', text: 'Recursos', href: '/app/recursos', group: 'Marketing' },

      { icon: 'browse_activity', text: 'Historiales', href: '/app/historiales', group: 'Cohacer' },
      { icon: 'group', text: 'Usuarios', href: '/app/usuarios', group: 'Cohacer' },
      { icon: 'quick_reorder', text: 'Recibir expediente', href: '/app/recibirexpediente', group: 'Expedientes' },
      { icon: 'settings', text: 'Configuración', href: '/app/configuracion', group: 'General' }
    ];

    const grouped: { [group: string]: { icon: string, text: string, href: string }[] } = {};
    menu.forEach(item => {
      if (!grouped[item.group]) grouped[item.group] = [];
      grouped[item.group].push({ icon: item.icon, text: item.text, href: item.href });
    });
    return grouped;
  }

  runOnboarding(): void {
    if (!this.onboardingComponent) return;

    this.onboardingComponent.steps = [
      {
        element: null,
        title: '¡Bienvenido!',
        description: 'Este es tu panel principal de Cohacer.',
        action: ['Siguiente', 'Saltar'],
        actionHandler: (action: string, _step: any, onboarding: any) => {
          if (action === 'Siguiente') onboarding.next();
          else onboarding.hide();
        }
      },
      {
        element: document.querySelector('.toggle'),
        title: 'Menú lateral',
        description: 'Usa este botón para expandir u ocultar el menú.',
        action: ['Anterior', 'Siguiente'],
        actionHandler: (action: string, _step: any, onboarding: any) => {
          if (action === 'Siguiente') onboarding.next();
          else onboarding.previous();
        }
      },
      {
        element: document.querySelector('.logout-button'),
        title: 'Cerrar sesión',
        description: 'Haz clic aquí cuando termines tu sesión.',
        action: ['Anterior', 'Finalizar'],
        actionHandler: (action: string, _step: any, onboarding: any) => {
          if (action === 'Finalizar') onboarding.hide();
          else onboarding.previous();
        }
      }
    ];

    this.onboardingComponent.show();
  }
}
