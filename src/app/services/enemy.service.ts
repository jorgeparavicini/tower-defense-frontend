import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, Observable, shareReplay } from "rxjs";
import { environment } from "src/environments/environment";
import { EnemyModel } from "../models/enemy.model";

@Injectable({
  providedIn: 'root'
})
export class EnemyService {
  private readonly endpoint = environment.backend + 'enemies';
  private cache$?: Observable<Map<string, EnemyModel>>;

  constructor(private http: HttpClient) {}

  public getEnemyModels(): Observable<Map<string, EnemyModel>> {
    if (!this.cache$) {
      this.cache$ = this.http.get(this.endpoint).pipe(
        map((response: any) => this.convertToMap(response)),
        shareReplay(1)
      )
    }

    return this.cache$;
  }

  private convertToMap(data: any): Map<string, EnemyModel> {
    let result = new Map<string, EnemyModel>();
    for (const [key, value] of Object.entries(data)) {
      result.set(key, new EnemyModel(value));
    }
    return result;
  }
}
