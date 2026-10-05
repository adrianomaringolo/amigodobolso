import type { ArticleRead } from '@/lib/education/types'
import { createClient } from '@/lib/supabase/client'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

const QUERY_KEY = ['article_reads']

async function fetchReads(): Promise<ArticleRead[]> {
	const supabase = createClient()
	const { data, error } = await supabase
		.from('article_reads')
		.select('article_slug, read_at')
		.order('read_at', { ascending: false })

	if (error) throw new Error(error.message)
	return (data ?? []).map((r) => ({ articleSlug: r.article_slug, readAt: r.read_at }))
}

export const useArticleReads = () => {
	const query = useQuery({ queryKey: QUERY_KEY, queryFn: fetchReads })
	const reads = query.data ?? []
	return { ...query, reads, readSlugs: new Set(reads.map((r) => r.articleSlug)) }
}

/** Marks or unmarks an article as read for the signed-in user (RLS scopes the rows). */
export const useToggleArticleRead = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async ({ slug, read }: { slug: string; read: boolean }) => {
			const supabase = createClient()
			const {
				data: { user },
			} = await supabase.auth.getUser()
			if (!user) throw new Error('Sessão expirada')

			const { error } = read
				? await supabase
						.from('article_reads')
						.upsert(
							{ user_id: user.id, article_slug: slug, read_at: new Date().toISOString() },
							{ onConflict: 'user_id,article_slug' },
						)
				: await supabase
						.from('article_reads')
						.delete()
						.eq('user_id', user.id)
						.eq('article_slug', slug)

			if (error) throw new Error(error.message)
		},
		onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
	})
}
