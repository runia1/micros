import { useRouter } from "next/router";

export default function useQueryParam({
    page,
    identifier,
    defaultValue,
}: {
    page: string;
    identifier: string;
    defaultValue: number;
}): [number, (newValue: number) => void] {
    const router = useRouter();
    const queryParam = router.query[identifier];
    const value = queryParam
        ? Array.isArray(queryParam)
            ? parseInt(queryParam[0])
            : parseInt(queryParam)
        : defaultValue;

    function updateValue(newValue: number) {
        router.push(`/${page}?${identifier}=${newValue}`);
    }

    return [value, updateValue];
}
