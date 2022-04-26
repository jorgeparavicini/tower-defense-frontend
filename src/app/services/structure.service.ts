import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, shareReplay, map } from 'rxjs';
import { StructureModel } from '../models/structure.model';

@Injectable({
  providedIn: 'root',
})
export class StructureService {
  private readonly endpoint = environment.backend + 'structures';
  private cache$?: Observable<Map<string, StructureModel>>;

  constructor(private http: HttpClient) {}

  public getStructureData(): Observable<Map<string, StructureModel>> {
    if (!this.cache$) {
      this.cache$ = this.http.get(this.endpoint).pipe(
        map((response: any) => new Map<string, StructureModel>(Object.entries(response))),
        shareReplay(1)
      );
    }

    return this.cache$;
  }
}
