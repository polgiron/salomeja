import { Component, OnInit, ChangeDetectionStrategy, Input, ChangeDetectorRef } from '@angular/core';
import { Tile } from 'src/app/models/tile.model';
import { LightboxService } from 'src/app/services/lightbox.service';
import { InfosService } from 'src/app/services/infos.service';
import { HomeService } from 'src/app/services/home.service';

@Component({
  selector: 'app-tile',
  templateUrl: './tile.component.html',
  styleUrls: ['./tile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TileComponent implements OnInit {
  @Input() data: Tile;
  @Input() hoverProjectId: number;
  @Input() projectTitleLetter: string;
  isLoaded: boolean = false;
  isInViewport: boolean = false;

  constructor(
    private lightboxService: LightboxService,
    private infosService: InfosService,
    private ref: ChangeDetectorRef,
    private homeService: HomeService
  ) { }

  ngOnInit() { }

  openInfos() {
    this.infosService.open(true);
  }

  openLightbox(image: any) {
    this.lightboxService.open(image);
  }

  onMouseEnterLetterTile() {
    this.homeService.setHoverLogo(true);
  }

  onMouseLeaveLetterTile() {
    this.homeService.setHoverLogo(false);
  }

  onMouseEnterProjectTile(image: any) {
    this.homeService.setHoverProjectId(image.projectId);
  }

  onMouseLeaveProjectTile() {
    this.homeService.setHoverProjectId(null);
  }

  onLoad() {
    this.isLoaded = true;
    this.ref.markForCheck();
  }

  onDeferLoad() {
    this.isInViewport = true;
    this.ref.markForCheck();
  }
}
