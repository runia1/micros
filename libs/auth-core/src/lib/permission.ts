export class Permission {
    private operations: {
        c: boolean;
        r: boolean;
        u: boolean;
        d: boolean;
    };
    private subject: 'all' | 'own';
    private entity: string;

    constructor(perm: string) {
        const pattern = /([crud]+)(All|Own)(\w*)/;
        const matches = perm.match(pattern);

        if (matches === null) {
            throw Error('Invalid Permission format');
        }

        // provide default values
        this.operations = {
            c: false,
            r: false,
            u: false,
            d: false,
        };

        const actions = <('c' | 'r' | 'u' | 'd')[]>matches[1].split('');
        this.operations = actions.reduce((accumulator, action) => {
            accumulator[action] = true;
            return accumulator;
        }, this.operations);
        this.subject = <'all' | 'own'>matches[2].toLowerCase();
        this.entity = matches[3] ? matches[3] : 'all';
    }

    isGreaterThanOrEqualTo(perm: Permission): boolean {
        //console.log("comparing", this, perm);

        // first we need to see if this entity even matches
        if (this.entity !== 'all' && this.entity !== perm.entity) {
            return false;
        }

        // we know the entity is greater than or equal, let's check the subject
        if (this.subject !== 'all' && perm.subject === 'all') {
            return false;
        }

        // lastly let's check the operation
        if (
            (!this.operations.c && perm.operations.c) ||
            (!this.operations.r && perm.operations.r) ||
            (!this.operations.u && perm.operations.u) ||
            (!this.operations.d && perm.operations.d)
        ) {
            return false;
        }

        return true;
    }

    prettyPrint() {
        const keys = <['c' | 'r' | 'u' | 'd']>Object.keys(this.operations);
        const prettyOperations = keys
            .map((op) => Permission.mapOperationsToPrint(op))
            .join(' / ');

        const prettySubject = Permission.pascalCaseWord(this.subject);

        const prettyEntity = Permission.pascalCaseWord(this.entity);

        return `${prettyOperations} ${prettySubject} ${prettyEntity}`;
    }

    private static mapOperationsToPrint(op: 'c' | 'r' | 'u' | 'd') {
        switch (op) {
            case 'c':
                return 'Add';
            case 'r':
                return 'View';
            case 'u':
                return 'Edit';
            case 'd':
                return 'Delete';
        }
    }

    private static pascalCaseWord(word: string) {
        return word[0].toUpperCase() + word.slice(1);
    }
}
