import { Component, OnInit, HostListener } from '@angular/core';
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
  allEnrolls: any[] = [];
  filteredEnrolls: any[] = [];
  paginatedEnrolls: any[] = [];

  searchTerm: string = '';
  itemsPerPage = 10;
  currentPage = 1;
  totalPages = 1;

  selectedEnroll: any = null;
  loading: boolean = true;
  error: string | null = null;

  constructor(private financiationService: FinanciationService) {}

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData(): void {
    this.loading = true;
    this.financiationService.getUnfinanced().subscribe({
      next: (res) => {
        this.allEnrolls = res || [];
        this.filteredEnrolls = this.allEnrolls;
        this.totalPages = Math.ceil(this.filteredEnrolls.length / this.itemsPerPage);
        this.currentPage = 1;
        this.updatePaginated();
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message;
        this.loading = false;
      }
    });
  }

  applyFilter(): void {
    const term = this.searchTerm.trim().toLowerCase();

    if (term === '') {
      this.filteredEnrolls = this.allEnrolls;
    } else {
      this.filteredEnrolls = this.allEnrolls.filter(enroll =>
        enroll.user?.name?.toLowerCase().includes(term) ||
        enroll.company?.name?.toLowerCase().includes(term) ||
        enroll.career?.name?.toLowerCase().includes(term) ||
        enroll.user?.email?.toLowerCase().includes(term)
      );
    }

    this.totalPages = Math.ceil(this.filteredEnrolls.length / this.itemsPerPage);
    this.currentPage = 1;
    this.updatePaginated();
    this.searchTerm = '';
  }

  updatePaginated(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedEnrolls = this.filteredEnrolls.slice(start, end);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginated();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginated();
    }
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

    this.loading = true;
    this.financiationService.submitFinancing(this.selectedEnroll._id, this.selectedEnroll.financial).subscribe({
      next: () => {
        this.selectedEnroll = null;
        this.fetchData();
      },
      error: (err) => {
        this.error = err.message;
        this.loading = false;
      }
    });
  }

  @HostListener('document:keydown.enter', ['$event'])
  handleEnter(event: KeyboardEvent) {
    if (this.searchTerm) {
      this.applyFilter();
    }
  }
}
