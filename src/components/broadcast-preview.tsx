import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import BroadcastEmail from '@/emails/broadcast-email';
import { render } from '@react-email/render';


interface BroadcastPreviewProps {
  subject: string
  content: string
}

export async function BroadcastPreview({ subject, content }: BroadcastPreviewProps) {

  const html = await render(<BroadcastEmail subject={subject} content={content} />, {
    pretty: true,
  });

  const iframeSrc = `data:text/html;charset=utf-8,${html}`;


  return (
    <div className='w-full h-full bg-white border border-gray-200 border-[4px] rounded-md p-4'>
      <iframe src={iframeSrc} className='w-full h-[800px]' />
    </div>
  )
}
