import { getBlogPosts } from '@/api/wordpress-api';
import { stripHtmlTags } from '@/utils/helper';
import type { BlogPost } from '@/utils/wordpress-types';
import BlogCarouselSection from './BlogCarouselSection';

interface BlogCarouselItemData {
  id: number;
  title: string;
  description: string;
  image: string;
  link: string;
}

/**
 * Wrapper komponenta pro BlogCarouselSection, která načítá data z WordPress API
 */
const BlogCarouselSectionWrapper = async () => {
  // Načteme nejnovější blog posty (např. 3-5 postů pro carousel)
  const blogData = await getBlogPosts(5, 1);

  // Mapujeme BlogPost na formát BlogCarouselItemData
  const carouselData: BlogCarouselItemData[] = blogData.nodes.map((post: BlogPost) => {
    const imageUrl = post.featuredImage?.node?.sourceUrl || '/images/placeholder.webp';
    const excerpt = post.excerpt ? stripHtmlTags(post.excerpt) : '';

    return {
      id: post.databaseId,
      title: post.title,
      description: excerpt,
      image: imageUrl,
      link: `/${post.slug}`,
    };
  });

  return <BlogCarouselSection posts={carouselData} />;
};

export default BlogCarouselSectionWrapper;
