import { Component, ElementRef, effect, inject, signal, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { AiService } from '../../services/ai.service';

interface Message {
  from: 'user' | 'bot';
  text: string;
  error?: boolean;
}

const GREETING =
  '¡Hola! Soy el asistente de Ya Quedo. Cuentame que necesitas y ' +
  'te recomiendo los mejores tecnicos disponibles en nuestra base de datos. ' +
  'Puedes indicarme categoria, distrito y presupuesto.';

const SUGGESTIONS = [
  'Necesito un electricista en Miraflores para instalar 4 tomacorrientes, presupuesto 300 soles',
  'Se rompio el cano del bano, tengo una fuga urgente',
  'Quiero pintar mi departamento de 60m2, ¿cuanto costaria?',
  'Busco un carpintero para hacer un mueble a medida en Surco',
];

@Component({
  selector: 'app-assistant',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './assistant.component.html',
})
export class AssistantComponent {
  private ai = inject(AiService);
  private bodyRef = viewChild<ElementRef<HTMLElement>>('chatBody');

  draft = '';
  sending = signal(false);
  messages = signal<Message[]>([{ from: 'bot', text: GREETING }]);
  suggestions = SUGGESTIONS;

  constructor() {
    effect(() => {
      const _ = this.messages();
      queueMicrotask(() => {
        const el = this.bodyRef()?.nativeElement;
        if (el) el.scrollTop = el.scrollHeight;
      });
    });
  }

  send(text: string = this.draft): void {
    const value = text.trim();
    if (!value || this.sending()) return;

    this.push({ from: 'user', text: value });
    this.draft = '';
    this.sending.set(true);

    this.ai.recommend(value).subscribe({
      next: (res) => {
        const reply = res?.data?.reply ?? 'Sin respuesta.';
        this.push({ from: 'bot', text: reply });
        this.sending.set(false);
      },
      error: (err: HttpErrorResponse) => {
        const msg =
          err?.error?.message ??
          err?.message ??
          'No se pudo obtener respuesta del asistente. Intenta de nuevo.';
        this.push({ from: 'bot', text: msg, error: true });
        this.sending.set(false);
      },
    });
  }

  onKey(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.send();
    }
  }

  private push(m: Message): void {
    this.messages.update((list) => [...list, m]);
  }

  reset(): void {
    this.messages.set([{ from: 'bot', text: GREETING }]);
    this.draft = '';
  }
}
