import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { EnrollService } from '../../services/enroll.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-enroll-documents',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './enroll-documents.component.html',
  styleUrls: ['./enroll-documents.component.scss']
})
export class EnrollDocumentsComponent implements OnInit {
  user: any = null;
  profile: any = null;
  evaluator: any = null;
  myDocuments: any[] = [];
  loading = true;
  error = '';
  isUploading = false;
  photoPreview: string | null = null;
  selectedFormat: any = null;
  showVideo = false;
  videoUrl: string = '';

  constructor(
    private enrollService: EnrollService,
    private router: Router,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
  this.enrollService.getProfile().subscribe({
    next: (res) => {
    this.profile = res[0];
      this.user = res.user;
      this.photoPreview = this.user?.photo || null;
      console.log('Perfil cargado:', res);

      if (this.profile.evaluatorId) {
        this.enrollService.getEvaluator(this.profile.evaluatorId).subscribe({
          next: (evaluator) => {
            this.evaluator = evaluator;
          },
          error: () => {
            console.warn('No se pudo cargar el evaluator');
          }
        });
      }

      if (this.profile._id) {
        this.enrollService.getMyDocuments(this.profile._id).subscribe({
          next: (docs) => {
            this.myDocuments = docs;
            this.loading = false; // ✅ Solo aquí, cuando ya todo se cargó
          },
          error: () => {
            console.warn('No se pudo cargar los documentos del usuario');
            this.loading = false;
          }
        });
      } else {
        this.loading = false; // fallback si no hay _id
      }
    },
    error: () => {
      this.error = 'No se pudo cargar el perfil';
      this.loading = false;
    }
  });
}


  goToCase(): void {
    this.router.navigate(['/app/casopractico']);
  }

  goToArmado(): void {
    this.router.navigate(['/app/armado-fisico']);
  }

  handlePhotoInput(event: Event): void {
  const input = event.target as HTMLInputElement;
  if (!input.files?.length) return;

  const file = input.files[0];
  const reader = new FileReader();

  reader.onload = () => {
    this.photoPreview = reader.result as string;
  };
  reader.readAsDataURL(file);

  if (!this.profile?._id) {
    alert('Falta el ID de inscripción');
    return;
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('format', 'photo');
  formData.append('enroll', this.profile._id); // importante

  this.isUploading = true;

  this.enrollService.uploadDocument(formData).subscribe({
    next: () => {
      this.isUploading = false;
    },
    error: (err) => {
      this.isUploading = false;
      console.error(err);
      alert('Error al subir la foto');
    }
  });
}


  openExternalLink(url: string): void {
    window.open(url, '_blank');
  }

  goToInternal(url: string): void {
    this.router.navigate([url]);
  }

  selectFile(format: any): void {
    this.selectedFormat = format;
    const input = document.getElementById('fileInput') as HTMLInputElement;
    if (input) input.click();
  }

  handleFileInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length || !this.selectedFormat || !this.profile) return;

    const file = input.files[0];
    const formData = new FormData();
    formData.append('file', file);
    formData.append('formatId', this.selectedFormat._id);
    formData.append('enrollId', this.profile._id);

    this.enrollService.uploadDocument(formData).subscribe({
      next: () => {
        alert('Documento subido correctamente');
      },
      error: () => {
        alert('Error al subir documento');
      }
    });
  }

  openVideo(url: string): void {
    this.videoUrl = url;
    this.showVideo = true;
  }

  closeVideo(): void {
    this.videoUrl = '';
    this.showVideo = false;
  }

  getSafeUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  getDocumentStatus(formatId: string): string {
    const doc = this.myDocuments.find(d => d.format._id === formatId);
    return doc?.status || 'Pendiente';
  }

  getLatestNote(formatId: string): string | null {
    const doc = this.myDocuments.find(d => d.format._id === formatId);
    if (doc?.notes?.length) {
      return doc.notes[doc.notes.length - 1].note;
    }
    return null;
  }
}
