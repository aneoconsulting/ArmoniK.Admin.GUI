import { AsyncPipe } from "@angular/common";
import { NgModule } from "@angular/core";
import { GrpcPagerService } from "@armonik.admin.gui/shared/data-access";
import { AutoRefreshDropdownComponent } from "@armonik.admin.gui/shared/feature";
import { ClrDatagridModule } from "@clr/angular";
import { TranslateModule } from "@ngx-translate/core";
import { PartitionsListRoutingModule } from "./partitions-list-routing.module";
import { PartitionsListComponent } from "./partitions-list.page";

@NgModule({
    declarations: [PartitionsListComponent],
    imports: [
        AutoRefreshDropdownComponent,
        ClrDatagridModule,
        TranslateModule,
        AsyncPipe,
        PartitionsListRoutingModule
    ],
    providers: [
        GrpcPagerService
    ],
})
export class PartitionsListModule {}