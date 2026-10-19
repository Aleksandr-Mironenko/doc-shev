export function revertSlug(slug: string): string {
    const engToRus: [string, string][] = [
        ['sch', 'щ'],
        ['yo', 'ё'],
        ['zh', 'ж'],
        ['ts', 'ц'],
        ['ch', 'ч'],
        ['sh', 'ш'],
        ['yu', 'ю'],
        ['ya', 'я'],
        ['ia', 'иа'],
        ['a', 'а'],
        ['b', 'б'],
        ['v', 'в'],
        ['g', 'г'],
        ['d', 'д'], // Исправлено с ['д', 'д'] на ['d', 'д']
        ['e', 'е'],
        ['z', 'з'],
        ['i', 'и'],
        ['j', 'й'],
        ['k', 'к'],
        ['l', 'л'],
        ['m', 'м'],
        ['n', 'н'],
        ['o', 'о'],
        ['p', 'п'],
        ['r', 'р'],
        ['s', 'с'],
        ['t', 'т'],
        ['u', 'у'],
        ['f', 'ф'],
        ['h', 'х'],
        ['y', 'ы'],
    ]

    let text = slug

    // 1. Сначала заменяем дефисы на пробелы
    text = text.replace(/-/g, ' ')

    // 2. Затем заменяем английские комбинации на русские буквы
    for (const [eng, rus] of engToRus) {
        const regex = new RegExp(eng, 'g')
        text = text.replace(regex, rus)
    }

    return text
}
