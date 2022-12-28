import { AsyncPipe } from "@angular/common";
import { NgModule } from "@angular/core";
import { GrpcPagerService } from "@armonik.admin.gui/shared/data-access";
import { ClrDatagridModule } from "@clr/angular";
import { TranslateModule } from "@ngx-translate/core";
import { ActionBarComponent } from "../../../shared/feature";
import { PartitionsListRoutingModule } from "./partitions-list-routing.module";
import { PartitionsListComponent } from "./partitions-list.page";

@NgModule({
    declarations: [PartitionsListComponent],
    imports: [
        ActionBarComponent,
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