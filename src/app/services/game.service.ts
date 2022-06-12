import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, shareReplay, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private readonly endpoint = environment.backend + 'games';

  constructor(private http: HttpClient) {}

  public getSavedGames(): Observable<string[]> {
    return this.http.get(this.endpoint).pipe(
      map((response: any) => response as string[]),
      shareReplay(1)
    );
  }
}
