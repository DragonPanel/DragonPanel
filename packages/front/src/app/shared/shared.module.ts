import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from "primeng/card";
import { InputTextModule } from "primeng/inputtext";
import { ButtonModule } from "primeng/button";
import { RippleModule } from 'primeng/ripple';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    CardModule,
    InputTextModule,
    ButtonModule,
    RippleModule,
    FormsModule
  ],
  exports: [
    CommonModule,
    CardModule,
    InputTextModule,
    ButtonModule,
    RippleModule,
    FormsModule
  ]
})
export class SharedModule { }
