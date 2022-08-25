import * as yup from 'yup';
import type { BaseSchema } from 'yup';

// yup.addMethod(yup.string, "currency", function () {
//     return this.test(function (value) {
//         const currencies = ["€", "$"];
//         const isCurrency = currencies.includes(value!);

//         if (!isCurrency) {
//             return this.createError({
//                 message: `${value} is not a valid currency, use on of [${currencies}]`,
//             });
//         }

//         return true;
//     });
// });

export const registerCustomValidators = () => {
    yup.addMethod(yup.string, 'noSpecialChars', function () {
        return this.matches(/^(?!.*[\<\>\"\'\%\;\(\)\&\+\/\!\:]).*$/, {
            message: (params) => {
                return `${params.path} must not have special characters in it`;
            },
        });
    });
};

declare module 'yup' {
    interface StringSchema<
        TType extends string | null | undefined = string | undefined,
        TContext extends Record<string, any> = Record<string, any>,
        TOut extends TType = TType
    > extends BaseSchema<TType, TContext, TOut> {
        // Any custom yup validators will need to also specify their typings here
        noSpecialChars(): this;
    }
}
