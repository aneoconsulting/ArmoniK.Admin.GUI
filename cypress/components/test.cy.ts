import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { ConfirmationDialogComponent } from "@components/dialogs/confirmation/confirmation.dialog"
import { ConfirmationDialogData } from "@components/dialogs/confirmation/type";

describe('ConfirmationDialogComponent', () => {
  const mockDialogRef = {
    close: () => {},
  } as unknown as MatDialogRef<ConfirmationDialogComponent>;

  const content = ['This text should be displayed', 'on two different lines'];

  const mockInputData: ConfirmationDialogData = {
    title: 'Dialog test',
    content: content,
    actions: {
      cancel: 'Cancel',
      confirm: 'Confirm'
    }
  };

  describe('Text content', () => {
    describe('With fully provided data', () => {
      beforeEach(() => {
        cy.mount(ConfirmationDialogComponent, {
          providers: [
            { provide: MAT_DIALOG_DATA, useValue: mockInputData },
            { provide: MatDialogRef, useValue: mockDialogRef },
          ],
          imports: [
            MatDialogModule,
            MatButtonModule,
          ],
        });
      });
      
      it('should display the input title', () => {
        cy.get('h2').should('have.text', mockInputData.title);
      });

      describe('content', () => {
        let children: Cypress.Chainable<JQuery<HTMLElement>>;
        beforeEach(() => {
          children = cy.get('mat-dialog-content').children();
        });

        it('should have a matching size between the mat-dialog-content length and the input content length', () => {
          children.should('have.length', content.length);
        });

        it('The mat-dialog-content text should match the input content text', () => {
          for (const text of content) {
            children.next().should('have.text', text);
          }
        });
      });

      it('should display the input cancel button', () => {
        cy.get('[data-cy=cancel]').should('have.text', mockInputData.actions!.cancel);
      });

      it('should display the input confirm button', () => {
        cy.get('[data-cy=confirm]').should('have.text', mockInputData.actions!.confirm);
      });
    });

    describe('With only required data', () => {
      const mockInputRequiredData: ConfirmationDialogData = {
        content: content,
      };

      let component: ConfirmationDialogComponent;

      beforeEach(() => {
        cy.mount(ConfirmationDialogComponent, {
          providers: [
            { provide: MAT_DIALOG_DATA, useValue: mockInputRequiredData },
            { provide: MatDialogRef, useValue: mockDialogRef },
          ],
          imports: [
            MatDialogModule,
            MatButtonModule,
          ],
        }).then(response => {
          component = response.component;
        });
      });

      it('should display the default title', () => {
        cy.get('h2').should('have.text', component.defaultTitle);
      });

      describe('content', () => {
        let children: Cypress.Chainable<JQuery<HTMLElement>>;
        beforeEach(() => {
          children = cy.get('mat-dialog-content').children();
        });

        it('should have a matching size between the mat-dialog-content length and the input content length', () => {
          children.should('have.length', content.length);
        });

        it('The mat-dialog-content text should match the input content text', () => {
          for (const text of content) {
            children.next().should('have.text', text);
          }
        });
      });

      it('should display the default cancel button', () => {
        cy.get('[data-cy=cancel]').should('have.text', component.defaultActions.cancel);
      });
      
      it('should display the default confirm button', () => {
        cy.get('[data-cy=confirm]').should('have.text', component.defaultActions.confirm);
      });
    });
  });

  describe('Interractions', () => {
    beforeEach(() => {
      cy.mount(ConfirmationDialogComponent, {
        providers: [
          { provide: MAT_DIALOG_DATA, useValue: mockInputData },
          { provide: MatDialogRef, useValue: mockDialogRef },
        ],
        imports: [
          MatDialogModule,
          MatButtonModule,
        ],
      }).then(response => {
        cy.spy(response.component, 'close').as('closeSpy');
      });
    });

    describe('Actions', () => {
      it('should align items to the end', () => {
        cy.get('mat-dialog-actions').should('have.attr', 'align', 'end');
      });

      it('should have an action that close with "false"', () => {
        cy.get('[data-cy=cancel]').click()
        cy.get('@closeSpy').should('have.been.calledWith', false);
      });

      it('should have an action that close with "true"', () => {
        cy.get('[data-cy=confirm]').click();
        cy.get('@closeSpy').should('have.been.calledWith', true);
      });

      it('should set the primary color on the confirm button', () => {
        cy.get('[data-cy=confirm]').should('have.attr', 'color', 'primary');
      });
    });
  });
});