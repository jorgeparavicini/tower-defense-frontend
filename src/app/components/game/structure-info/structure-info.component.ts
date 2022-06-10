import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { Structure, StructureModel } from 'src/app/models/structure.model';
import { StructureService } from 'src/app/services/structure.service';

@Component({
  selector: 'app-structure-info',
  templateUrl: './structure-info.component.html',
  styleUrls: ['./structure-info.component.scss'],
  host: { class: 'h-100 p-3' },
})
export class StructureInfoComponent implements OnInit {
  onStructureUpgrade = new EventEmitter<Structure>();
  selectedStructure?: Structure;

  get selectedStructureModel(): StructureModel {
    return this.structures.get(this.selectedStructure!.model)!;
  }

  structures!: Map<String, StructureModel>;

  constructor(structureService: StructureService) {
    structureService.getStructureData().subscribe((x) => (this.structures = x));
  }

  ngOnInit(): void {}

  selectStructure(structure?: Structure) {
    this.selectedStructure = structure;
  }

  deselect() {
    this.selectedStructure = undefined;
  }

  upgrade() {
    this.onStructureUpgrade.emit(this.selectedStructure);
    this.deselect();
  }
}
