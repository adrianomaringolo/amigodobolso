import { createClient } from '@/lib/supabase/client'
import { UserTag } from '@/lib/types/Entry.type'
import { objectToCamel } from '@/lib/utils/convertCase'
import { useQuery } from '@tanstack/react-query'

const COLLECTION = 'user_tags'

/**
 * Every tag the current user has already used, most-used first — feeds the
 * autocomplete in the transaction form. Backed by the `user_tags` view.
 */
const fetchTags = async () => {
	const supabase = createClient()
	const { data, error } = await supabase
		.from(COLLECTION)
		.select('tag, uses')
		.order('uses', { ascending: false })
		.order('tag', { ascending: true })

	if (error) throw new Error(error.message)
	return objectToCamel(data) as UserTag[]
}

export const useGetTags = (enabled = true) => {
	const query = useQuery({
		queryKey: [COLLECTION],
		enabled,
		staleTime: 60 * 1000,
		queryFn: fetchTags,
	})
	return { ...query, data: (query.data ?? []) as UserTag[] }
}
