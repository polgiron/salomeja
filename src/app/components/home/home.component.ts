import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { slideInAnimation, lightboxAnimation, homeFadeInAnimation } from 'src/app/utils/animations';
import { Tile } from 'src/app/models/tile.model';
import { LightboxService } from 'src/app/services/lightbox.service';
import { takeWhile } from 'rxjs/operators';
import { InfosService } from 'src/app/services/infos.service';
import { HomeService } from 'src/app/services/home.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [slideInAnimation, lightboxAnimation, homeFadeInAnimation]
})
export class HomeComponent implements OnInit {
  private _alive: boolean = true;
  lettersPosition = [
    { index: 0, letter: 'S' },
    { index: 2, letter: 'L' },
    { index: 4, letter: 'M' },
    { index: 6, letter: 'J' },
    { index: 7, letter: 'A' }
  ];
  tiles: Tile[] = [];
  lightboxIndex: number;
  openInfos: boolean = false;
  displayLetters: boolean = true;
  hoverProjectId: number;
  tmpTiles: Tile[] = [];
  hoverLogo: boolean;
  removeZindex: boolean;
  isMobile: boolean;

  constructor(
    private homeService: HomeService,
    private ref: ChangeDetectorRef,
    private lightboxService: LightboxService,
    private infosService: InfosService
  ) { }

  ngOnInit() {
    this.isMobile = window.innerWidth <= 767;

    this.buildTiles();

    this.lightboxService.lightboxChannel()
      .pipe(takeWhile(() => this._alive))
      .subscribe((index: number) => {
        this.lightboxIndex = index;
        this.ref.markForCheck();
      });

    this.infosService.openInfosChannel()
      .pipe(takeWhile(() => this._alive))
      .subscribe((state: boolean) => {
        this.openInfos = state;
        this.ref.markForCheck();

        if (window.innerWidth >= 768) {
          if (state) {
            setTimeout(() => {
              this.displayLetters = false;
              this.ref.markForCheck();
            }, 850);
          } else {
            this.displayLetters = true;
            this.ref.markForCheck();
          }
        } else {
          this.removeZindex = state;
          this.ref.markForCheck();
        }
      });

    this.homeService.onHoverLogoChannel()
      .pipe(takeWhile(() => this._alive))
      .subscribe((state: boolean) => {
        this.hoverLogo = state;
        this.ref.markForCheck();
      });

    this.homeService.onHoverProjectIdChannel()
      .pipe(takeWhile(() => this._alive))
      .subscribe((projectId: number) => {
        if (this.hoverProjectId != projectId) {
          this.hoverProjectId = projectId;
          this.setTileProjectLetter(projectId);
          this.ref.markForCheck();
        }
      });
  }

  ngOnDestroy() {
    this._alive = false;
  }

  setTileProjectLetter(id: number) {
    // this.tiles = this.tiles.filter(tile => !tile.tmp);
    this.tmpTiles = [];

    if (id) {
      const currentProjectTitle: string = this.homeService.projects.find(project => project.id == id).title;
      let i: number = 0;
      this.tiles.forEach((tile: Tile, index: number) => {
        if (tile.images && !tile.images.find(image => image.projectId == id)) {
          if (currentProjectTitle[i]) {
            const letter: string = this.parseProjectLetter(currentProjectTitle[i]);
            tile.projectTitleLetter = letter.toUpperCase()
          }
          i++;
        }
      });
      if (i < currentProjectTitle.length - 1) {
        for (let j = i; j < currentProjectTitle.length; j++) {
          const letter: string = this.parseProjectLetter(currentProjectTitle[j]);
          this.tmpTiles.push({
            projectTitleLetter: letter.toUpperCase()
          })
        }
      }
    } else {
      this.tiles.forEach(tile => {
        if (tile.images && !tile.images.find(image => image.projectId == id)) {
          tile.projectTitleLetter = null
        }
      });
    }
  }

  parseProjectLetter(letter: string): string {
    if (letter == '?') {
      return 'INTEROGATION';
    } else if (letter == '/') {
      return 'SLASH';
    } else if (letter == '#') {
      return 'DIEZE';
    } else if (letter == ' ') {
      return 'SPACE';
    } else {
      return letter;
    }
  }

  async buildTiles() {
    await this.homeService.getProjects();
    const images = this.homeService.images;

    let i: number = 0;

    this.chunk(images, 4).map(images => {
      this.tiles.push({
        id: i++,
        images: images
      });
    });

    // Insert letters
    this.lettersPosition.map(letter => {
      this.tiles.splice(letter.index, 0, {
        id: i++,
        letter: letter.letter
      });
    });

    this.ref.markForCheck();
  }

  chunk(array: any[], length: number) {
    let chunks = [];
    let i = 0;
    let n = array.length;

    while (i < n) {
      chunks.push(array.slice(i, i += length));
    }

    return chunks;
  }

  trackByFunction(index: number, item: any) {
    if (!item) {
      return null;
    }
    return item.id;
  }
}
