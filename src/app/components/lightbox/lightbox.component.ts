import { Component, OnInit, Input, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { LightboxService } from 'src/app/services/lightbox.service';
import { Image, Project } from 'src/app/models/project.model';
import { HomeService } from 'src/app/services/home.service';
import { Utils } from 'src/app/utils/utils';
import { slideInAnimation } from 'src/app/utils/animations';

@Component({
  selector: 'app-lightbox',
  templateUrl: './lightbox.component.html',
  styleUrls: ['./lightbox.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [slideInAnimation]
})
export class LightboxComponent implements OnInit, OnDestroy {
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
  openInfos: boolean = false;
  windowHeight: number;

  constructor(
    private homeService: HomeService,
    private lightboxService: LightboxService,
    private ref: ChangeDetectorRef,
    private utils: Utils
  ) { }

  ngOnInit() {
    this.windowHeight = window.innerHeight;
    this.images = this.homeService.images;
    this._keydownListener = this.onKeydown.bind(this);
    window.addEventListener('keydown', this._keydownListener);
    this._resizeListener = this.onWindowResize.bind(this);
    window.addEventListener('resize', this._resizeListener);
    this.setDialogSize();
    this.setTranslate();
  }

  ngOnDestroy() {
    window.removeEventListener('keydown', this._keydownListener);
    window.removeEventListener('resize', this._resizeListener);
  }

  onWindowResize() {
    this.setDialogSize();
    this.setTranslate();
  }

  setDialogSize() {
    this.entryHeight = this.utils.isMobile ? window.innerHeight - 3 * this.padding - 15 : window.innerHeight - 2 * this.padding;
    this.entryWidth = 2 * this.entryHeight / 3;

    if (this.entryWidth > window.innerWidth - 2 * this.padding) {
      this.entryWidth = window.innerWidth - 2 * this.padding
      this.entryHeight = this.entryWidth * 3 / 2;
    }

    this.ref.markForCheck();
  }

  setTranslate() {
    this.setCurrentImage();
    const marginRight: number = this.utils.isMobile ? 6 : 22.8 * 16;
    this.translate = (this.entryWidth + marginRight) * this.lightboxIndex;
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

  onClickMoreInfos() {
    this.openInfos = true;
    this.ref.markForCheck();
  }

  closeInfos() {
    this.openInfos = false;
    this.ref.markForCheck();
  }

  swipeRight() {
    this.prev();
  }

  swipeLeft() {
    this.next();
  }
}
