import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaymentLinkService } from '../../services/payment-link.service';

@Component({
  selector: 'app-admin-payment-links',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-payment-links.component.html',
  styleUrls: ['./admin-payment-links.component.scss']
})
export class AdminPaymentLinksComponent implements OnInit {
  allLinks: any[] = [];
  filteredLinks: any[] = [];
  searchTerm = '';
  loading = true;
  error: string | null = null;

  constructor(private paymentLinkService: PaymentLinkService) {}

  ngOnInit(): void {
    this.fetchLinks();
  }

  fetchLinks(): void {
    this.loading = true;
    this.paymentLinkService.getPaymentLinks().subscribe({
      next: (res) => {
        this.allLinks = (res || []).map((enroll: any) => {
          const payment = enroll.financial?.payments?.find((p: any) => p.status === 'Pendiente de liga de pago');
          return {
            user: enroll.user?.name || '',
            reference: payment?.reference || '',
            amount: payment?.amount || 0,
            textAmount: parseFloat(payment?.amount || 0).toLocaleString('es-MX', {
              style: 'currency',
              currency: 'MXN'
            })
          };
        });
        this.filteredLinks = this.allLinks;
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
      this.filteredLinks = this.allLinks;
    } else {
      this.filteredLinks = this.allLinks.filter(link =>
        link.user.toLowerCase().includes(term) ||
        link.reference.toLowerCase().includes(term)
      );
    }
  }
}
