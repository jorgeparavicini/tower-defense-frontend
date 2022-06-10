import { Component, OnInit } from '@angular/core';
import { StructureModel } from 'src/app/models/structure.model';
import { GameService } from 'src/app/services/game.service';
import { StructureService } from 'src/app/services/structure.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-structure-shop',
  templateUrl: './structure-shop.component.html',
  styleUrls: ['./structure-shop.component.scss']
})
export class StructureShopComponent implements OnInit {
  resourcesUrl = environment.resourcesUrl;

  structures!: Map<String, StructureModel>;
  selectedStructure?: String;

  constructor(structureService: StructureService) {
    structureService.getStructureData().subscribe(x => this.structures = x);
   }

  ngOnInit(): void {
  }

  selectStructure(structure: String) {
    this.selectedStructure = structure;
  }

  consumeSelectedStructure(): void {
    this.selectedStructure = undefined;
  }

  buyableStructures(): Map<String, StructureModel> {
    const filteredMap = new Map<String, StructureModel>();

    this.structures.forEach((value, key) => {
      if (value.can_be_bought) {
        filteredMap.set(key, value);
      }
    });

    return filteredMap;
  }

}
