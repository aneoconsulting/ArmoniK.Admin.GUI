import { AsyncPipe } from "@angular/common";
import { NgModule } from "@angular/core";
import { AutoRefreshDropdownComponent } from "@armonik.admin.gui/shared/feature";
import { TranslateModule } from "@ngx-translate/core";
import { PartitionsListComponent } from "./partitions-list.component";

@NgModule({
    declarations: [PartitionsListComponent],
    imports: [

    ],
    providers: [
        AutoRefreshDropdownComponent,
        TranslateModule,
        AsyncPipe
    ],
})
export class PartitionsListModule {}