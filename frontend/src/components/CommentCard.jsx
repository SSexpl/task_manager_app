
const CommentCards=({comment,name,email,time})=>
{
return(

   <div class="flow-root border-b border-white ">
        <ul role="list" class="divide-y divide-gray-200 dark:divide-gray-700">

            <li class="py-1 sm:py-4">
                <div>
                <p class="mb-5 text-base text-gray-500 sm:text-lg dark:text-gray-400">{comment}</p>
                </div>
                <div class="flex items-center">
                    <div class="flex-1 min-w-0 ms-4">
                        <p class="text-base font-semibold  text-gray-900 truncate dark:text-white">
                          {name}
                        </p>

                    </div>
                    <div class="inline-flex items-center text-sm text-gray-900 dark:text-white">
                        {email}
                    </div>
                </div>
            </li>
          </ul>
   </div>

);
}
export default CommentCards;
