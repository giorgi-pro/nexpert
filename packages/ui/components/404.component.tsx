import Link from "next/link";
import { useTranslations } from "next-intl";

const NotFound404 = () => {
  const t = useTranslations("Pages");

  return (
    <div className="hero h-full">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold text-error">{t('NotFound.errorCode')}</h1>
          <p className="py-6 text-2xl">
            {t('NotFound.title')}
          </p>
          <p className="pb-6">
            {t('NotFound.description')}
          </p>
          <Link href="/" className="btn btn-primary">
            {t('NotFound.homeButton')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound404;
