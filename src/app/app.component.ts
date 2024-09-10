import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PeriodicElement } from './models/periodic-element.model';
import { MatButtonModule } from '@angular/material/button';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { EditDialogComponent } from './edit-dialog/edit-dialog.component';
import { debounceTime, delay, Observable, of, Subject } from 'rxjs';
import { PeriodicElementSerivce } from './services/element.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    MatButtonModule,
    MatFormFieldModule,
    MatTableModule,
    MatInputModule,
    MatIcon,
    MatDialogModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'Atipera-angular';

  displayedColumns: string[] = [
    'number',
    'name',
    'weight',
    'symbol',
    'actions',
  ];
  dataSource = new MatTableDataSource<PeriodicElement>();
  private searchSubject: Subject<string> = new Subject();

  constructor(
    private dialog: MatDialog,
    private periodicElementSerivce: PeriodicElementSerivce
  ) {}

  ngOnInit() {
    this.periodicElementSerivce.getData().subscribe((data) => {
      this.dataSource.data = data;
    });

    this.searchSubject.pipe(debounceTime(2000)).subscribe((searchText) => {
      this.dataSource.filter = searchText.trim().toLowerCase();
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.searchSubject.next(filterValue);
  }

  editElement(element: PeriodicElement) {
    const dialogRef = this.dialog.open(EditDialogComponent, {
      data: element,
      width: '20vw',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        result.position = element.position;
        const updatedData = this.dataSource.data.map((el) =>
          el.position === element.position ? result : el
        );

        this.dataSource.data = updatedData;
      }
    });
  }
}
