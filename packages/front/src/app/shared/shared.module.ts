import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from "primeng/card";
import { InputTextModule } from "primeng/inputtext";
import { ButtonModule } from "primeng/button";
import { RippleModule } from 'primeng/ripple';
import { BlockUIModule } from 'primeng/blockui';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ReactiveFormsModule } from '@angular/forms';
import { BlockableDirective } from './blockable.directive';


@NgModule({
  declarations: [
    BlockableDirective
  ],
  imports: [
    CommonModule,
    CardModule,
    InputTextModule,
    ButtonModule,
    RippleModule,
    BlockUIModule,
    ProgressSpinnerModule,
    ReactiveFormsModule
  ],
  exports: [
    CommonModule,
    CardModule,
    InputTextModule,
    ButtonModule,
    RippleModule,
    BlockUIModule,
    ProgressSpinnerModule,
    ReactiveFormsModule,
    BlockableDirective
  ]
})
export class SharedModule { }
