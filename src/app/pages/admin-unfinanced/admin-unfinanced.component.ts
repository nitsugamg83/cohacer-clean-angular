import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FinanciationService } from '../../services/financiation.service';

@Component({
  selector: 'app-admin-unfinanced',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-unfinanced.component.html',
  styleUrls: ['./admin-unfinanced.component.scss']
})
export class AdminUnfinancedComponent implements OnInit {
  enrolls: any[] = [];
  selectedEnroll: any = null;
  loading: string | null = null;
  error: string | null = null;

  constructor(private financiationService: FinanciationService) {}

  ngOnInit(): void {
    this.loading = 'Cargando usuarios';
    this.financiationService.getUnfinanced().subscribe({
      next: (res) => {
        this.enrolls = res
          .filter(e => !!e.user?.name)
          .sort((a, b) => a.user.name.localeCompare(b.user.name));
        this.loading = null;
      },
      error: (err) => {
        this.error = err.message;
        this.loading = null;
      }
    });
  }

  onEdit(enroll: any): void {
    this.selectedEnroll = { ...enroll };
    if (!this.selectedEnroll.financial) this.selectedEnroll.financial = {};
    if (!this.selectedEnroll.financial.visibleToUser) {
      this.selectedEnroll.financial.visibleToUser = this.selectedEnroll.career?.price || 0;
    }
    if (!this.selectedEnroll.financial.discount) {
      this.selectedEnroll.financial.discount = 0;
    }

    const total = this.selectedEnroll.financial.visibleToUser - this.selectedEnroll.financial.discount;
    this.selectedEnroll.financial.locks = {
      inscription: total * 0.1,
      classes: total * 0.5,
      simulations: total * 0.75,
      tests: total,
      certification: total
    };
  }

  onSubmit(): void {
    if (!this.selectedEnroll) return;

    this.loading = 'Subiendo financiamiento';
    this.financiationService.submitFinancing(this.selectedEnroll._id, this.selectedEnroll.financial).subscribe({
      next: () => {
        this.enrolls = this.enrolls.filter(e => e._id !== this.selectedEnroll._id);
        this.selectedEnroll = null;
        this.loading = null;
      },
      error: (err) => {
        this.error = err.message;
        this.loading = null;
      }
    });
  }
}
