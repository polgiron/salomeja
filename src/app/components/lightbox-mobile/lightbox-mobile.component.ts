import { Component, OnInit, Input, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { LightboxService } from 'src/app/services/lightbox.service';
import { Image, Project } from 'src/app/models/project.model';
import { HomeService } from 'src/app/services/home.service';

@Component({
  selector: 'app-lightbox-mobile',
  templateUrl: './lightbox-mobile.component.html',
  styleUrls: ['./lightbox-mobile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LightboxMobileComponent implements OnInit, OnDestroy {
  @Input() lightboxIndex: number;
  private _keydownListener: EventListener;
  private _resizeListener: EventListener;
  currentProject: Project;
  images: Image[];
  currentImage: Image;
  padding: number = 6;
  entryWidth: number;
  entryHeight: number;
  translate: number;
  isAnimated: boolean = false;

  constructor(
    private homeService: HomeService,
    private lightboxService: LightboxService,
    private ref: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.images = this.homeService.images;
    this._keydownListener = this.onKeydown.bind(this);
    window.addEventListener('keydown', this._keydownListener);
    this._resizeListener = this.onWindowResize.bind(this);
    window.addEventListener('resize', this._resizeListener);
    this.setDialogSize();
    this.setTranslate();
  }

  onWindowResize() {
    this.setDialogSize();
    this.setTranslate();
  }

  setDialogSize() {
    this.entryHeight = window.innerHeight;
    this.entryWidth = 2 * this.entryHeight / 3;
    this.ref.markForCheck();
  }

  setTranslate() {
    this.setCurrentImage();
    this.translate = this.entryWidth * this.lightboxIndex;
    this.ref.markForCheck();
  }

  setCurrentImage() {
    this.currentImage = this.images[this.lightboxIndex];
    this.currentProject = this.homeService.projects.find(project => project.id == this.currentImage.projectId);
  }

  onClickDialog(index: number) {
    if (index < this.lightboxIndex) {
      this.prev();
    } else if (index > this.lightboxIndex) {
      this.next();
    }
  }

  prev() {
    if (this.lightboxIndex - 1 >= 0) {
      this.isAnimated = true;
      this.lightboxIndex--;
      this.setTranslate();
      this.ref.markForCheck();
    }
  }

  next() {
    if (this.lightboxIndex + 1 < this.images.length) {
      this.isAnimated = true;
      this.lightboxIndex++;
      this.setTranslate();
      this.ref.markForCheck();
    }
  }

  close() {
    this.lightboxService.close();
    this.ref.markForCheck();
  }

  onKeydown(event: any) {
    switch (event.key) {
      case 'Escape':
        this.close();
        break;
      case 'ArrowLeft':
        this.prev();
        break;
      case 'ArrowRight':
        this.next();
        break;
    }
  }

  ngOnDestroy() {
    window.removeEventListener('keydown', this._keydownListener);
    window.removeEventListener('resize', this._resizeListener);
  }
}
