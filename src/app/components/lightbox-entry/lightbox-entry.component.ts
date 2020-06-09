import { Component, OnInit, Input, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { fadeInAnimation, fadeOutAnimation } from 'src/app/utils/animations';
import { Image } from 'src/app/models/project.model';

@Component({
  selector: 'app-lightbox-entry',
  templateUrl: './lightbox-entry.component.html',
  styleUrls: ['./lightbox-entry.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInAnimation, fadeOutAnimation]
})
export class LightboxEntryComponent implements OnInit {
  @Input() image: Image;
  // mobileBreakpoint: number = 767;
  isInViewport: boolean;
  isLoaded: boolean;

  constructor(
    private ref: ChangeDetectorRef
  ) { }

  ngOnInit() { }

  async onDeferLoad() {
    this.isInViewport = true;
    this.ref.markForCheck();
  }

  onLoad() {
    this.isLoaded = true;
    this.ref.markForCheck();
  }
}
