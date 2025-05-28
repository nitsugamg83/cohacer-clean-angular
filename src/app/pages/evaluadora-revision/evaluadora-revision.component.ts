import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReviewService } from '../../services/iutm-review.service';

@Component({
  selector: 'app-admin-evaluadora-revision',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './evaluadora-revision.component.html',
  styleUrls: ['./evaluadora-revision.component.scss']
})
export class AdminEvaluadoraRevisionComponent implements OnInit {
  data: any[] = [];
  filteredData: any[] = [];
  paginatedData: any[] = [];

  searchTerm: string = '';
  loading: boolean = true;
  error: string | null = null;

  itemsPerPage: number = 10;
  currentPage: number = 1;
  totalPages: number = 1;

  rejectItem: any = null;
  comment: string = '';

  isGeneratingPDF = false;

  Math = Math; // ✅ expuesto al template para usar Math.min()

  constructor(private reviewService: ReviewService) {}

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData(): void {
    this.loading = true;
    this.error = null;
    this.reviewService.getReviews().subscribe({
      next: (res) => {
        this.data = res;
        this.filteredData = res;
        this.totalPages = Math.ceil(this.filteredData.length / this.itemsPerPage);
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

  updatePaginated(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedData = this.filteredData.slice(start, end);
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

  applyFilter(): void {
    const term = this.searchTerm.toLowerCase().trim();
    this.filteredData = this.data.filter(item =>
      item.user?.name.toLowerCase().includes(term) ||
      item.career?.name.toLowerCase().includes(term)
    );
    this.totalPages = Math.ceil(this.filteredData.length / this.itemsPerPage);
    this.currentPage = 1;
    this.updatePaginated();
  }

  async descargarPDF(item: any): Promise<void> {
    if (this.isGeneratingPDF) return;
    this.isGeneratingPDF = true;
    try {
      await this.reviewService.generatePDF(item);
    } catch (e) {
      console.error('Error generando PDF:', e);
    } finally {
      this.isGeneratingPDF = false;
    }
  }

  aceptar(item: any): void {
    this.reviewService.acceptReview(item).subscribe({
      next: () => this.fetchData(),
      error: (err) => this.error = err.message
    });
  }

  mostrarRechazo(item: any): void {
    this.rejectItem = item;
    this.comment = '';
  }

  rechazar(): void {
    if (!this.rejectItem || !this.comment.trim()) return;

    const data = {
      _id: this.rejectItem._id,
      comment: this.comment.trim(),
      status: 'Rechazado'
    };

    this.reviewService.rejectReview(data).subscribe({
      next: () => {
        this.rejectItem = null;
        this.comment = '';
        this.fetchData();
      },
      error: (err) => this.error = err.message
    });
  }
}
