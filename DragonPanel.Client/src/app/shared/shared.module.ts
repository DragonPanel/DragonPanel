import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { PanelModule } from 'primeng/panel';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { RippleModule } from 'primeng/ripple';

@NgModule({
  declarations: [],
  imports: [
    // Yeah, I may use both, idk
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    ButtonModule,
    CardModule,
    InputTextModule,
    FloatLabelModule,
    PanelModule,
    ToastModule,
    ProgressSpinnerModule,
    RippleModule,
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    ButtonModule,
    CardModule,
    InputTextModule,
    FloatLabelModule,
    PanelModule,
    ToastModule,
    ProgressSpinnerModule,
    RippleModule,
  ]
})
export class SharedModule { }
