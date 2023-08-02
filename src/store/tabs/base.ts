import type { BudgetStatementDocument } from '@acaldas/document-model-libs/browser/budget-statement';
import type { DocumentModelDocument } from '@acaldas/document-model-libs/browser/document-model';
import type { ScopeFrameworkDocument } from '@acaldas/document-model-libs/browser/scope-framework';
import {
    Action,
    BaseAction,
    Document,
    utils,
} from '@acaldas/document-model-libs/document';
import type { EditorComponent } from 'src/components/editors';

import tabNew from 'src/components/tabs/tab-new';

export type TabType =
    | 'new'
    | 'powerhouse/document-model'
    | 'powerhouse/budget-statement'
    | 'makerdao/scope-framework';

export interface ITab {
    type: TabType;
    id: string;
    name: string;
    content: EditorComponent;
    document?: Document;
}

export type Tab = ITab;

export const Tab = {
    serialize(tab: ITab) {
        const { type, id, name, document } = tab;
        return JSON.stringify({ type, id, name, document });
    },
    async fromString(value: string): Promise<ITab> {
        const object = JSON.parse(value);
        const type = object.type as TabType;
        switch (object.type) {
            case 'new':
                return createTab(object.id);
            case 'powerhouse/budget-statement':
                return createBudgetStatementTab(
                    object.budgetStatement,
                    object.id
                );
            case 'makerdao/scope-framework':
                return createScopeFrameworkTab(
                    object.scopeFramework,
                    object.id
                );
            case 'powerhouse/document-model':
                return createDocumentModelTab(object.id, object.name);
            default:
                throw new Error(`Tab type ${type} was not handled`);
        }
    },
    async fromDocument<T extends Document>(
        document: T,
        id?: string
    ): Promise<ITab> {
        switch (document.documentType) {
            case 'powerhouse/budget-statement':
                return createBudgetStatementTab(
                    document as BudgetStatementDocument,
                    id
                );
            case 'makerdao/scope-framework':
                return createScopeFrameworkTab(
                    document as ScopeFrameworkDocument,
                    id
                );
            case 'powerhouse/document-model':
                return createDocumentModelTab(
                    document as DocumentModelDocument,
                    id
                );
            default:
                throw new Error(
                    `Document with type ${document.documentType} was not handled`
                );
        }
    },
};

export function createTab<T = unknown, A extends Action = Action>(
    type: TabType,
    id?: string,
    name?: string,
    document?: Document,
    content?: EditorComponent<T, A>
): ITab {
    return {
        type: type,
        id: id ?? window.crypto.randomUUID(),
        name: name ?? 'New tab',
        content: (content as unknown as EditorComponent) ?? tabNew,
        document,
    };
}

export function createDocumentTab<T = unknown, A extends Action = Action>(
    document: Document<T, A | BaseAction>,
    content?: EditorComponent<T, A>,
    id?: string,
    name?: string
) {
    return createTab(
        document.documentType as TabType,
        id,
        name ?? document.name,
        document,
        content
    );
}

export async function createScopeFrameworkTab(
    document?: ScopeFrameworkDocument,
    id?: string
) {
    const ScopeFramework = await import(
        '@acaldas/document-model-libs/browser/scope-framework'
    );
    const ScopeFrameworkEditor = (
        await import('src/components/editors/scope-framework')
    ).default;

    const scope =
        document ??
        utils.createDocument(
            ScopeFramework.createEmptyExtendedScopeFrameworkState()
        );
    return createDocumentTab(scope, ScopeFrameworkEditor, id, 'New scope');
}

export async function createBudgetStatementTab(
    document?: BudgetStatementDocument,
    id?: string
) {
    const BudgetStatement = await import(
        '@acaldas/document-model-libs/browser/budget-statement'
    );
    const BudgetStatementEditor = (
        await import('src/components/editors/budget-statement')
    ).default;
    const scope = document ?? BudgetStatement.utils.createBudgetStatement();
    return createDocumentTab(scope, BudgetStatementEditor, id, 'New budget');
}

export async function createDocumentModelTab(
    document?: DocumentModelDocument,
    id?: string
) {
    const DocumentModel = await import(
        '@acaldas/document-model-libs/browser/document-model'
    );
    const DocumentModelEditor = (
        await import('src/components/editors/document-model')
    ).default;

    const scope =
        document ??
        utils.createDocument(
            DocumentModel.createEmptyExtendedDocumentModelState()
        );
    return createDocumentTab(
        scope,
        DocumentModelEditor,
        id,
        'New document model'
    );
}

export async function preloadTabs() {
    await Promise.all([
        import('@acaldas/document-model-libs/browser/scope-framework'),
        import('src/components/editors/scope-framework'),
        import('@acaldas/document-model-libs/browser/budget-statement'),
        import('src/components/editors/budget-statement'),
    ]);
}